var app = angular.module('myApp', ['ngGrid', 'multi-select']);
app.controller('MyCtrl', function ($scope) {
    $scope.bo = [];
    $scope.filter = "mo";
    $scope.clientName = "";
    $scope.filterOptions = {
        filterText: ''
    };
    $scope.sc = [];
    $scope.filterType = "";
    $scope.businesObjects = [
        {name: "clients"},
        {name: "offices"},
        {name: "loans"}
    ];
    $scope.searchName = "";
    $scope.db = {
        clients: {
            tableName: "m_client",
            fields: ["id", "account_no", "firstname", "lastname", "display_name", "mobile_no"],
            joins: {
                offices: {
                    table: "m_office",
                    idColumn: "office_id",
                    valueColumn: 'name'
                }
            },
            filters: {
                filter: {query:"SELECT `m_office`.`id`, `m_office`.`name` FROM m_office",table:"m_office",column:"office_id"}
            }
        },
        offices: {
            tableName: "m_office",
            fields: ["id", "external_id", "name", "opening_date"]
        },
        loans: {
            tableName: "m_loan",
            fields: ["id", "account_no", "product_id", "loan_officer_id", "loan_status_id", "currency_code", "principal_amount",
                "approved_principal", "nominal_interest_rate_per_period"],
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
                filter: {query:"SELECT `m_product_loan`.`id`, `m_product_loan`.`name` FROM m_product_loan",table:"m_product_loan",column:"product_id"}
            }
        }
    };
    $scope.cities = [];
    $scope.tableFields = [];
    $scope.searchInFields = [];
    $scope.selectedTables = [];
    $scope.$watch("bo", function (old, newVal) {
        if ($scope.bo[0]) {
            $scope.tableFields = [];

            table1 = $scope.bo[0].name
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.bo[0].name].tableName);
            for (i = 0; i < $scope.db[$scope.bo[0].name].fields.length; i++) {
                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].fields[i] + "`");
                if ($scope.db[$scope.bo[0].name].fields[i] !== "id")
                    $scope.tableFields.push({name: $scope.db[$scope.bo[0].name].fields[i]});
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
            $.getJSON("getdata.php?q="+$scope.db[$scope.bo[0].name].filters.filter.query, function (result) {
                $scope.cities = result;
                $scope.$apply()
            });

        }
    });

    $scope.myData = [

    ];
    $scope.loadData = function () {
        if ($scope.bo[0]) {
            $scope.sql = null;
            $scope.sql = squel.select();
            $scope.sql.from($scope.db[$scope.bo[0].name].tableName);
            for (i = 0; i < $scope.db[$scope.bo[0].name].fields.length; i++) {

                $scope.sql.field("`" + $scope.db[$scope.bo[0].name].tableName + "`.`" + $scope.db[$scope.bo[0].name].fields[i] + "`");
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
            if ($scope.sc.length > 0) {
                var m = [];
                for (i = 0; i < $scope.sc.length; i++) {
                    m.push(parseInt($scope.sc[i].id));
                }
                if ($scope.bo[0].name === "clients") {
                    var whereQuery = "";
                    for (i = 0; i < $scope.searchInFields.length; i++) {
                        whereQuery += $scope.searchInFields[i].name;
                        whereQuery += " like '%";
                        whereQuery += $scope.clientName;
                        whereQuery += "%'";
                        if (i !== $scope.searchInFields.length - 1) {
                            whereQuery += " or "
                        } else {
                            whereQuery += " and "
                        }
                    }
                    $scope.sql.where(whereQuery +" "+$scope.db[$scope.bo[0].name].filters.filter.column +" in ?", m);
                }
            } else {
                if ($scope.bo[0].name === "clients") {
                    $scope.sql.where("display_name like '%" + $scope.clientName + "%'");
                }
            }
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