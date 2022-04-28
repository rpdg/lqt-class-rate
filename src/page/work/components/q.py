import json


class User:
    def __init__(self, name, code):
        self.name = name
        self.code = code


class UserEncoder(json.JSONEncoder):
    def default(self, user):
        if isinstance(user, User):
            return {
                "name": user.name,
                "code": user.code
            }
        return json.JSONEncoder.default(self, user)


print(json.dumps(User('tom', 'SZ-33'), cls=UserEncoder))
