Bibi.x({

    name: "plugin"

})(function() {

    Bibi.plugin = {};
    Bibi.plugin.bind = function(Name, Fn) {
        var Binded = E.bind(Name, Fn);
        return [Binded.Name, Binded.Index].join("-");
    };
    Bibi.plugin.unbind = function(NameAndIndex) {
        NameAndIndex = NameAndIndex.split("-");
        return E.unbind({ Name: NameAndIndex[0], Index: NameAndIndex[1] });
    };
    E.bind("bibi:createMenus", function() {
        Bibi.plugin.addMenu = function(Param, Fn){
            return C.addButton({
                id: Param.id,
                Category: "menu",
                Group: "extension",
                Labels: [{ en: Param.label }],
                IconHTML: '<span class="bibi-icon" style="background: url(' + Param.img  + ') no-repeat center center;"></span>'
            }, Fn);
        };
        Bibi.plugin.deleteMenu = function(ButtonID){
            return C.removeButton(document.getElementById(ButtonID));
        }
    });

});