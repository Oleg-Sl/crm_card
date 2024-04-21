import re
from rest_framework import views
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
# import logging
# import json
# import os


# log_file = 'dealapp.log'
# log_dir = os.path.dirname(os.path.abspath(__file__))
# log_path = os.path.join(log_dir, log_file)


# logging.basicConfig(filename=log_path, level=logging.INFO)

class InstallApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        return render(request, 'deal/install.html')


class IndexApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        r = request.data.get("PLACEMENT_OPTIONS", [])
        # logging.info(json.dumps(request.data))

        try:
            match = re.search(r'\d+', r)
            id_deal = match.group(0) if match else None
            data = {"id": id_deal}
            return render(request, 'deal/index.html', context=data)
        except TypeError:
            return HttpResponse("Ошибка: Не найден идентификатор сделки", status=400)


class TaskAppInstallApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        return render(request, 'task/install.html')


class TaskAppIndexApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        r = request.data.get("PLACEMENT_OPTIONS", [])
        placement = request.data.get("PLACEMENT", [])
        # logging.info(json.dumps(request.data))
        try:
            match = re.search(r'\d+', r)
            id_entity = match.group(0) if match else None
            if placement == 'CRM_DEAL_DETAIL_TAB':
                data = {"dealId": id_entity, "taskId": None}
            else:
                data = {"taskId": id_entity, "dealId": None}
            return render(request, 'tpz/index.html', context=data)
        except TypeError:
            return HttpResponse("Ошибка: Не найден идентификатор задачи", status=400)
