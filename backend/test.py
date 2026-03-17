import requests
try:
    resp = requests.post("http://127.0.0.1:8000/api/cases/analyze", json={"title": "test", "raw_text": "text"})
    resp.raise_for_status()
    print("SUCCESS", resp.text)
except requests.exceptions.HTTPError as e:
    print("FAILED", e.response.status_code)
    print(e.response.text)
