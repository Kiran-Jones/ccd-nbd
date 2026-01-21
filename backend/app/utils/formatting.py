from typing import List


def merge_formatting_spans(bold: List[bool], italic: List[bool], text: str) -> str:
    """
    Convert character-level formatting to HTML-like spans.
    Returns formatted string with <b> and <i> tags.
    """
    if not text:
        return ""

    result = []
    in_bold = False
    in_italic = False

    for i, char in enumerate(text):
        is_bold = bold[i] if i < len(bold) else False
        is_italic = italic[i] if i < len(italic) else False

        # Handle bold transitions
        if is_bold and not in_bold:
            result.append("<b>")
            in_bold = True
        elif not is_bold and in_bold:
            result.append("</b>")
            in_bold = False

        # Handle italic transitions
        if is_italic and not in_italic:
            result.append("<i>")
            in_italic = True
        elif not is_italic and in_italic:
            result.append("</i>")
            in_italic = False

        result.append(char)

    # Close any remaining tags
    if in_italic:
        result.append("</i>")
    if in_bold:
        result.append("</b>")

    return "".join(result)
