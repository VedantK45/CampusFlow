import redis
import json

r = redis.Redis(
    host="localhost",
    port=6380,
    ssl=True,
    ssl_cert_reqs=None,
    decode_responses=True
)

payload = {
    "pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "subject": "Test Notice",
    "sender": "Dean Academics",
    "received_at": "2026-06-14",
    "category": "academic"
}

r.xadd(
    "campusflow_pdf_stream",
    {
        "payload": json.dumps(payload)
    }
)

print("✅ Test message sent")