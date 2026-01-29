from collections import deque
from threading import Lock
from time import time
from typing import Deque, Dict

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimiter:
    def __init__(self) -> None:
        self._requests: Dict[str, Deque[float]] = {}
        self._lock = Lock()

    def allow(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = time()
        cutoff = now - window_seconds

        with self._lock:
            bucket = self._requests.get(key)
            if bucket is None:
                bucket = deque()
                self._requests[key] = bucket

            while bucket and bucket[0] <= cutoff:
                bucket.popleft()

            if len(bucket) >= max_requests:
                return False

            bucket.append(now)
            return True


class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        limiter: RateLimiter,
        default_max_requests: int,
        default_window_seconds: int,
        ai_max_requests: int,
        ai_window_seconds: int,
    ) -> None:
        super().__init__(app)
        self._limiter = limiter
        self._default_max = default_max_requests
        self._default_window = default_window_seconds
        self._ai_max = ai_max_requests
        self._ai_window = ai_window_seconds

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path.startswith("/api"):
            client_ip = request.client.host if request.client else "unknown"

            if path == "/api/narrative":
                key = f"{client_ip}:ai"
                allowed = self._limiter.allow(key, self._ai_max, self._ai_window)
            else:
                key = f"{client_ip}:default"
                allowed = self._limiter.allow(
                    key, self._default_max, self._default_window
                )

            if not allowed:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again later."},
                )

        return await call_next(request)
