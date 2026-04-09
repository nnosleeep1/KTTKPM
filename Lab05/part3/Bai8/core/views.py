from django.http import JsonResponse


def index(request):
    return JsonResponse({'message': 'Django app running with Celery and Redis'})
