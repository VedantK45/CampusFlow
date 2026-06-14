import json
import redis
import os

from pdf_processor import PDFProcessor
from mongodb_store import MongoVectorStore


STREAM_NAME = "campusflow_pdf_stream"
GROUP_NAME = "campusflow_group"
CONSUMER_NAME = "worker_1"


def create_group(r):

    try:
        r.xgroup_create(
            STREAM_NAME,
            GROUP_NAME,
            id="0",
            mkstream=True
        )

    except redis.exceptions.ResponseError:
        pass


def main():

    r = redis.Redis(
        host=os.getenv("REDIS_HOST"),
        port=int(os.getenv("REDIS_PORT")),
        ssl=True,
        ssl_cert_reqs=None,
        decode_responses=True
    )

    create_group(r)

    mongo_store = MongoVectorStore()

    processor = PDFProcessor(
        mongo_store
    )

    print(
        "🚀 CampusFlow Worker Started"
    )

    while True:

        messages = r.xreadgroup(
            GROUP_NAME,
            CONSUMER_NAME,
            {STREAM_NAME: ">"},
            count=1,
            block=5000
        )

        if not messages:
            continue

        for stream_name, stream_messages in messages:

            for message_id, data in stream_messages:

                try:

                    payload = json.loads(
                        data["payload"]
                    )

                    print(
                        f"📄 Processing: {payload['subject']}"
                    )

                    processor.process_pdf(
                        payload["pdf_url"],
                        payload
                    )

                    r.xack(
                        STREAM_NAME,
                        GROUP_NAME,
                        message_id
                    )

                    print(
                        "✅ Done"
                    )

                except Exception as e:

                    print(
                        f"❌ Error: {e}"
                    )


if __name__ == "__main__":
    main()