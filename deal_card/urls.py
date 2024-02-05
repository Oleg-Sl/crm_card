from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('bitrix-crm-card/admin/', admin.site.urls),
    path('bitrix-crm-card/dealapp/', include('dealapp.urls', namespace='dealapp')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
