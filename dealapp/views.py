import re
from rest_framework import views
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
import logging
import json


logging.basicConfig( filename='dealapp.log')

class InstallApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        return render(request, 'deal/install.html')


class IndexApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        r = request.data.get("PLACEMENT_OPTIONS", [])
        logging.info(json.dumps(request.data))

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
        logging.info(json.dumps(request.data))
        try:
            match = re.search(r'\d+', r)
            id_task = match.group(0) if match else None
            data = {"id": id_task}
            return render(request, 'tpz/index.html', context=data)
        except TypeError:
            return HttpResponse("Ошибка: Не найден идентификатор задачи", status=400)
