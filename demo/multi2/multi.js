

angular.module("demo").controller("MultiDemoController2", function($scope) {

    var itemIndexGlobal;
    var salePointIndexGlobal;
    var globalItem;

    $scope.models = [
        {
            Dates: [],
            Visits: [],
            SalePoints: [],
            dragging: false,
            SelectedItems: []
        }
    ];

    /**
     * dnd-dragging determines what data gets serialized and send to the receiver
     * of the drop. While we usually just send a single object, we send the array
     * of all selected items here.
     */
    $scope.getSelectedItemsIncluding = function(list, item) {
        list.SelectedItems = [];

        for (var m=0; m<list.Visits.length; m++){
            if (list.Visits[m].Selected){
                list.SelectedItems[m] = list.Visits[m];
            }
        }

        return list.Visits.filter(function(item) { return item.selected; });
    };

    /**
     * We set the list into dragging state, meaning the items that are being
     * dragged are hidden. We also use the HTML5 API directly to set a custom
     * image, since otherwise only the one item that the user actually dragged
     * would be shown as drag image.
     */
    $scope.onDragstart = function(item, index, event) {
        $scope.models[0].startIndex = index;
        console.log(item);

        var trueCounter = 0;

        if (!$scope.models[0].SelectedItems.length){

            console.log('Старт: '+index);
            for (var i = 0; i<$scope.models[0].SelectedItems.length; i++){
                if ($scope.models[0].Visits[i].Date === item.Date){
                    $scope.models[0].Visits[i].Selected = true;
                }
            }
        }

        console.log('Старт: '+index);

        if (event.dataTransfer.setDragImage) {
            var img = new Image();
            img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
            event.dataTransfer.setDragImage(img, 0, 0);
        }
    };

    /**
     * In the dnd-drop callback, we now have to handle the data array that we
     * sent above. We handle the insertion into the list ourselves. By returning
     * true, the dnd-list directive won't do the insertion itself.
     */
    $scope.onDrop = function(list, index, parentIndex) {
        console.log('Дроп: '+index);

        var save = goclone(list.Visits),
            status = false;

        var result = checkForError(list, index, status);

        status = result.status;


        if (status){
            console.info('Восстановлено сохраненное сосотояние');
            list.Visits = save;

        }


        return true;
    };

    //Проверка на грани

    var checkForError = function(list, index, status){
        var save = goclone(list.Visits);

        //Проверка на выбранные элементы
        if (list.SelectedItems){

            //Проверка на выбранность
            for (var m=0; m<list.Visits.length; m++){
                if (list.Visits[m].Selected){

                    //Проходим по датам
                    for (var j = 0; j<list.Dates.length; j++){

                        //Определение индекса в календаре по оси OX
                        if (list.Visits[m].Selected &&
                            list.Visits[m].Date == list.Dates[j].Date){

                            //Границы OY оси X
                            if ((j + index - list.startIndex) <=0 || (j + index - list.startIndex) >= list.Dates.length){
                                if (!!list.Dates[j + index - $scope.models[0].startIndex] === false){
                                    status = true;
                                    break;
                                }
                            }

                            list.Visits[m].Date = list.Dates[j + index - list.startIndex].Date;
                            break;

                        }
                    }

                    //Проверка на повторение объекта в этой же дате с тем же сейл поинтом
                    if (_.where(list.Visits, {SalePointID: list.Visits[m].SalePointID, Date: list.Visits[m].Date}).length>1){
                        status = true;
                    }
                }
            }
        }



        return {list: list, status: status}
    };

    /**
     * Last but not least, we have to remove the previously dragged items in the
     * dnd-moved callback.
     */
    $scope.onMoved = function(list) {
        //list.Visits = list.Visits.filter(function(item) { return !item.selected; });
        $scope.changeDate();
    };

    // Generate the initial model
    angular.forEach($scope.models, function(list) {

        for (var j = 1; j <= 1; ++j) {
            for (var i = 1; i <= 50; ++i) {
                var monthName,
                    oldI = i,
                    oldJ = j,
                    dateI = 0,
                    dateJ = 0;

                switch (j){
                    case 1:
                        monthName = 'Январь';
                        break;
                    case 2:
                        monthName = 'Февраль';
                        break;
                    case 3:
                        monthName = 'Март';
                        break;
                    case 4:
                        monthName = 'Апрель';
                        break;
                    case 5:
                        monthName = 'Май';
                        break;
                }

                if (i!==4 && j!==2){


                    if (i<10){
                        dateI = '0'+i;
                    } else {
                        dateI = i;
                    }

                    if (j<10){
                        dateJ = '0'+j
                    } else {
                        dateJ = j;
                    }


                    list.Dates.push(
                        {
                            "Date" : "2015-"+dateJ+"-"+dateI,
                            "Year" : 2015,
                            "Month" : monthName,
                            "Day" : i,
                            "IsNow" : false,
                            "UserID":null
                        }
                    );
                } else {

                    if (i<10){
                        dateI = '0'+i;
                    } else {
                        dateI = i;
                    }

                    if (j<10){
                        dateJ = '0'+j
                    } else {
                        dateJ = j;
                    }

                    list.Dates.push(
                        {
                            "Date" : "2015-"+dateJ+"-"+dateI,
                            "Year" : 2015,
                            "Month" : monthName,
                            "Day" : i,
                            "IsNow" : true,
                            "UserID":null
                        }
                    );
                }

            }
        }

        list.Visits = [
            {
                "Id" : 1,
                "Date" : "2015-01-03",
                "SalePointID" : 1,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : true,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 2,
                "Date" : "2015-01-08",
                "SalePointID" : 2,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 3,
                "Date" : "2015-01-12",
                "SalePointID" : 2,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 4,
                "Date" : "2015-01-06",
                "SalePointID" : 2,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 5,
                "Date" : "2015-01-13",
                "SalePointID" : 2,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 6,
                "Date" : "2015-01-14",
                "SalePointID" : 3,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 7,
                "Date" : "2015-01-11",
                "SalePointID" : 3,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 8,
                "Date" : "2015-01-09",
                "SalePointID" : 3,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            },
            {
                "Id" : 9,
                "Date" : "2015-01-08",
                "SalePointID" : 1,
                "StatusID" : 7,
                "IsPlaned" : true,
                "IsProductive" : false,
                "Sortable" : true,
                "Dragable" : true
            }
        ];

        list.SalePoints = [];
        for (var i = 0; i < 50; i++) {
            list.SalePoints.push({
                "Id" : i+1,
                "RegionID" : i+1,
                "Name" : "Сидоров Пётр Сегреевич",
                "Address" : "Адрес " + (i + 1)
            });
        }


    });

    $scope.changeDate = function(){
        $scope.dragndropData = [];
        for (var i = 0; i<$scope.models[0].SalePoints.length; i++){

            $scope.dragndropData.push([]);

            for (var j = 0; j<$scope.models[0].Dates.length; j++){

                for (var k = 0; k<$scope.models[0].Visits.length; k++){

                    if (
                        $scope.models[0].Visits[k].Date == $scope.models[0].Dates[j].Date &&
                        $scope.models[0].Visits[k].SalePointID == $scope.models[0].SalePoints[i].Id
                    ){
                        $scope.dragndropData[i].push({
                            j:j,
                            k:k
                        });
                    }

                }
            }
        }
    };

    $scope.changeDate();
    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});

function goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof(source)=="object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}
