import redis

r = redis.Redis(
    host="localhost",
    port=6380,
    ssl=True,
    ssl_cert_reqs=None,
    decode_responses=True
)

print(r.ping())