var app = angular.module('myApp', ['ngGrid', 'multi-select']);
app.controller('MyCtrl', function ($scope) {
    $scope.bo = [];
    $scope.filter = "mo";
    $scope.clientName = "";
    $scope.filterOptions = {
        filterText: ''
    };
    $scope.currentBOFilters = {};
    $scope.sc = [];
    $scope.filterOutputData = {};
    $scope.filterInputData = {};
    $scope.filterType = "";
    $scope.businesObjects = [
        {name: "clients"},
        {name: "offices"},
        {name: "loans"}
    ];
    $scope.searchFields = {};
    $scope.searchFieldValues = {};
    $scope.searchName = "";
    $scope.db = {
        clients: {
            tableName: "m_client",
            fields: [
                {name: "id", type: "number"},
                {name: "account_no", type: "string"},
                {name: "firstname", type: "string"},
                {name: "lastname", type: "string"},
                {name: "display_name", type: "string"},
                {name: "mobile_no", type: "string"}
            ],
            joins: {
                offices: {
                    table: "m_office",
                    idColumn: "office_id",
                    valueColumn: 'name'
                }
            },
            filters: {
                filter: {query: "SELECT `m_office`.`id`, `m_office`.`name` FROM m_office", table: "m_office", column: "office_id"},
                filter2: {query: "SELECT `m_office`.`id`, `m_office`.`name` FROM m_office", table: "m_office", column: "office_id"}
            }
        },
        offices: {
            tableName: "m_office",
            fields: [
                {name: "id", type: "number"},
                {name: "external_id", type: "number"},
                {name: "name", type: "string"},
                {name: "opening_date", type: "date"}
            ]
        },
        loans: {
            tableName: "m_loan",
            fields: [
                {name: "id", type: "number"},
                {name: "account_no", type: "string"},
                {name: "product_id", type: "number"},
                {name: "loan_officer_id", type: "number"},
                {name: "loan_status_id", type: "number"},
                {name: "currency_code", type: "string"},
                {name: "principal_amount", type: "number"},
                {name: "approved_principal", type: "number"},
                {name: "nominal_interest_rate_per_period", type: "number"}
            ],
            joins: {
                client: {
                    table: "m_client",
                    idColumn: "client_id",
                    valueColumn: 'display_name'
                },
                product: {
                    table: "m_product_loan",
                    idColumn: "product_id",
                    valueColumn: 'name'
                }
            },
            filters: {
                product: {query: "SELECT `m_product_loan`.`id`, `m_product_loan`.`name` FROM m_product_loan",
                    table: "m_product_loan", column: "product_id"},
                client: {query: "SELECT `m_client`.`id`,`m_client`.`display_name` name FROM `m_client`", table: "m_client", column: "client_id"}
            }
        }
    };
    $scope.typeMap = {
        id: "number",
        account_no: "string",
        firstname: "string",
        lastname: "string",
        display_name: "string",
        mobile_no: "string",
        external_id: "number",
        product_id: "number",
        name: 'string',
        loan_officer_id: "number",
        loan_status_id: "number",
        currency_code: "string",
        principal_amount: "number",
        approved_principal: "number",
        nominal_interest_rate_per_period: "number"
    }
    $scope.cities = [];
    $scope.tableFields = [];
    $scope.searchInFields = [];
    $scope.selectedTables = [];
    $scope.$watch("bo", function (old, newVal) {
        if ($scope.bo[0]) {
            $scope.currentBOFilters = {};
            $scope.tableFields = [];
            for (key in $scope.db[$scope.bo[0].name].filters) {
                $scope.currentBOFilters[key] = $scope.db[$scope.bo[0].name].filters[key];
            }
            console.log($scope.currentBOFilters);
            table1 = $scope.bo[0].name
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.bo[0].name].tableName);
            for (i = 0; i < $scope.db[$scope.bo[0].name].fields.length; i++) {
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].fields[i].name + "`");
                if ($scope.db[$scope.bo[0].name].fields[i].name !== "id")
                    $scope.tableFields.push({name: $scope.db[$scope.bo[0].name].fields[i].name});
            }
            for (key in $scope.db[$scope.bo[0].name].joins) {
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].joins[key].table + "`.`"
                        + $scope.db[$scope.bo[0].name].joins[key].valueColumn + "` " + key)
                    .join($scope.db[$scope.bo[0].name].joins[key].table, null,
                        "`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].joins[key].idColumn + "`=`" +
                            $scope.db[$scope.bo[0].name].joins[key].table + "`.`id`");

            }
            console.log($scope.sql.toString());
            $scope.filterType = "Filters";
            for (key in $scope.currentBOFilters) {

                $.ajax({
                    type: "GET",
                    url: "getdata.php?q=" + $scope.db[$scope.bo[0].name].filters[key].query,
                    async: false,
                    cache: false
                }).done(function (msg) {
                        $scope.filterInputData[key] = msg;

                    })
            }


        }
    });
    $scope.$watch("searchInFields", function (old, newVal) {
        $scope.searchFields = {};
        console.log($scope.searchInFields);
        for (i = 0; i < $scope.searchInFields.length; i++) {
            $scope.searchFields[$scope.searchInFields[i].name] = {value: ""}
        }
    });
    $scope.myData = [

    ];
    $scope.loadData = function () {
        console.log($scope.searchFields);
        if ($scope.bo[0]) {
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.bo[0].name].tableName);
            for (i = 0; i < $scope.db[$scope.bo[0].name].fields.length; i++) {

                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].fields[i].name + "`");
            }
            for (key in $scope.db[$scope.bo[0].name].joins) {
                console.log(key);

                console.log("join")
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].joins[key].table + "`.`"
                        + $scope.db[$scope.bo[0].name].joins[key].valueColumn + "` " + key)
                    .join($scope.db[$scope.bo[0].name].joins[key].table, null,
                        "`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].joins[key].idColumn + "`=`" +
                            $scope.db[$scope.bo[0].name].joins[key].table + "`.`id`");

            }
            var inData = {};
            for (key in $scope.currentBOFilters) {
                inData[key] = [];
                for (i = 0; i < $scope.filterOutputData[key].length; i++) {

                    inData[key].push($scope.filterOutputData[key][i].id);
                }
            }
            console.log(inData);
            if ($scope.searchInFields.length > 0) {


                var whereQuery = "(";
                for (i = 0; i < $scope.searchInFields.length; i++) {
                    if ($scope.searchFields[$scope.searchInFields[i].name].value !== "") {


                        whereQuery += $scope.db[$scope.bo[0].name].tableName;
                        whereQuery += ".";
                        whereQuery += $scope.searchInFields[i].name;

                        if ($scope.typeMap[$scope.searchInFields[i].name] === "string") {
                            whereQuery += " like '%";
                        } else if ($scope.typeMap[$scope.searchInFields[i].name] === "number") {
                            whereQuery += "=";
                        }

                        whereQuery += $scope.searchFields[$scope.searchInFields[i].name].value;
                        if ($scope.typeMap[$scope.searchInFields[i].name] === "string")
                            whereQuery += "%'";
                        if (i !== $scope.searchInFields.length - 1) {
                            whereQuery += " or "
                        } else {

                        }
                    }
                }
                whereQuery += ")";
            } else {
                whereQuery = "";
            }
            if(whereQuery==="()"){
                whereQuery="";
            }
            console.log(whereQuery);
            var inQuery = "";
            for (key in inData) {
                if (inData[key].length > 0) {
                    inQuery += $scope.db[$scope.bo[0].name].filters[key].column;
                    inQuery += " in ("
                    for (i = 0; i < inData[key].length; i++) {
                        inQuery += inData[key][i];
                        if (i !== inData[key].length - 1) {
                            inQuery += ","
                        } else {
                            inQuery += ")"
                        }
                    }

                    inQuery += " and ";
                }

            }
            if (whereQuery==="") {
                inQuery = inQuery.substring(0, inQuery.length - 5);
            }
            console.log(inQuery);
            if(inQuery+whereQuery!=="()"){
                $scope.sql.where(inQuery + whereQuery);
            }
            console.log($scope.sql.toString());


            var q = $scope.sql.toString();
            console.log(q);
            $.getJSON("getdata.php?q=" + q, function (result) {
                $scope.myData = null;
                $scope.myData = result;
                $scope.$apply()
                $scope.gridOptions.ngGrid.buildColumns();
            });

        }
    }
    $scope.gridOptions = { data: 'myData', showGroupPanel: true, enableCellSelection: true, enablePinning: true,
        enableColumnResize: true,
        selectWithCheckboxOnly: true, showFilter: true, showFooter: true, showSelectionCheckbox: true};
});