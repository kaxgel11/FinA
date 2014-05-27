/**
 * Created by kakha on 5/27/14.
 */
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
        $scope.sql.where(whereQuery + " " + $scope.db[$scope.bo[0].name].filters.filter.column + " in ?", m);
    }
} else {
    if ($scope.bo[0].name === "clients") {
        $scope.sql.where("display_name like '%" + $scope.clientName + "%'");
    }
}