from rest_framework.renderers import JSONRenderer

# standardised http response 
# error_description {"username": "incorrect", "password": "incorrect}
# data: {}
# code: ""
class CustomRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = renderer_context['response'].status_code
        response = {
          "code": status_code,
          "data": data,
          "error_description": None
        }
        if not str(status_code).startswith('2'):
            response["data"] = None
            try:
                response["error_description"] = data["detail"]
            except KeyError:
                response["error_description"] = data
        return super(CustomRenderer, self).render(response, accepted_media_type, renderer_context)
