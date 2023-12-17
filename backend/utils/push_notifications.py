from exponent_server_sdk import (
    PushClient,
    PushMessage,
)
import requests

expo_api_key = 'WzTnjgzdFb6LDEWT7i7wZlDRZvhuoBX0cWJ45WQ4'

session = requests.Session()
session.headers.update(
    {
        "Authorization": f"Bearer {expo_api_key}",
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    }
)
def send_push_notifications(expo_tokens, title, message):

    push_client = PushClient(session=session)
    print(expo_tokens[0])
    messages = [
        PushMessage(to=token, body=message, title=title)
        for token in expo_tokens
    ]
    try:
        push_client.publish_multiple(messages)
        #print('Push notifications sent successfully.')
    except Exception as e:
        print(f'Error sending push notifications: {e}')

# Example usage
# expo_tokens = ['ExpoToken1', 'ExpoToken2', 'ExpoToken3']
# message_body = 'Hello from Python!'

# send_push_notifications(expo_tokens, message_body)
#'WzTnjgzdFb6LDEWT7i7wZlDRZvhuoBX0cWJ45WQ4'