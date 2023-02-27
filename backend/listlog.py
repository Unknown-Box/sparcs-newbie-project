from json import dumps, loads
from base64 import b64decode
from urllib.request import Request, urlopen

def lambda_handler(event, context):
    bodystr = event["body"] if not event["isBase64Encoded"] else b64decode(event["body"])
    body = loads(bodystr)

    log_created_at = body["createdAt"]

    url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-bgjek/endpoint/data/v1/action/find"
    headers = {
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*", 
        "api-key": "FMGf4bnqZMFUCEp9RToJUlgp89czIu2kTMCQFNUaeFaKi90FNvTxxCwK8ZUszkC6"
    }
    payload = {
        "collection": "logs", 
        "database": "rkrPqn", 
        "dataSource": "Cluster0", 
        "filter": {
            "createdAt": log_created_at
        }
    }

    http_req = Request(url, headers=headers, data=dumps(payload).encode(), method="POST")
    with urlopen(http_req) as http_res:
        return {
            "statusCode": 200, 
            "body": http_res.read()
        }