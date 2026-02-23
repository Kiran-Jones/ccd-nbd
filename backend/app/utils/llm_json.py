"""Utilities for parsing JSON from LLM responses that may include code fences,
trailing text, or unescaped control characters inside string values."""

import json
import re


def extract_json(text: str) -> str:
    """Extract a JSON object from LLM output that may include code fences or trailing text."""
    text = text.strip()
    # Strip markdown code fences
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text.strip())
    # Find the outermost { ... } by brace matching
    start = text.find("{")
    if start == -1:
        return text
    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(text)):
        c = text[i]
        if escape:
            escape = False
            continue
        if c == "\\":
            escape = True
            continue
        if c == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return text[start:]


def _escape_newlines_in_strings(text: str) -> str:
    """Walk JSON text and escape literal newlines/tabs inside string values."""
    result = []
    in_string = False
    i = 0
    while i < len(text):
        c = text[i]
        if c == "\\" and in_string and i + 1 < len(text):
            result.append(c)
            result.append(text[i + 1])
            i += 2
            continue
        if c == '"':
            in_string = not in_string
            result.append(c)
        elif in_string and c == "\n":
            result.append("\\n")
        elif in_string and c == "\r":
            result.append("\\r")
        elif in_string and c == "\t":
            result.append("\\t")
        else:
            result.append(c)
        i += 1
    return "".join(result)


def parse_llm_json(text: str) -> dict:
    """Extract and parse a JSON object from LLM output, handling common formatting issues."""
    text = extract_json(text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Fix unescaped control characters inside JSON string values
        return json.loads(_escape_newlines_in_strings(text))
