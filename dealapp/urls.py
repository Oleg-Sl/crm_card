from django.urls import include, path
from rest_framework import routers

from .views import (
    InstallApiView,
    IndexApiView,
    TaskAppInstallApiView,
    TaskAppIndexApiView,
    # GetImage
)


app_name = 'dealapp'
router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path('install/', InstallApiView.as_view()),                     # установка приложения
    path('index/', IndexApiView.as_view()),                         # обработчик приложения

    path('task-install/', TaskAppInstallApiView.as_view()),                     # установка приложения
    path('task-index/', TaskAppIndexApiView.as_view()),                         # обработчик приложения
    # path('get-image/', GetImage, name='get_image'),
]

urlpatterns += router.urls
