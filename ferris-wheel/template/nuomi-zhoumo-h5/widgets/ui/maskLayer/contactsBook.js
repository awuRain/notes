
define('ui/maskLayer/contactsBook', function(require, exports, module) {

var local = require("localstorage.js");

/**
 * 联系人电话薄
 */
var ContactsBook = function () {
    if (!local.getData("SCOPE_CONTACTS_BOOK")) {
        local.addData("SCOPE_CONTACTS_BOOK", {"contacts":[]});
    }
    this.update();
}

/**
 * 增加联系人
 * @param {array[{name: "xx", phone: 1333}]} persons
 */
ContactsBook.prototype.add = function (persons) {
    var self = this,
        tempContacts;

    tempContacts = $.map(self.contactsBook.contacts, function (obj) {
        var isExsit = false,
            oriContacts = obj;

        $.each(persons, function () {
            if (this.name == oriContacts.name) {
                isExsit = true;
                return false;
            }
        });

        if (!isExsit) {
            return oriContacts;
        }
    });

    tempContacts = persons.concat(tempContacts);
    tempContacts = tempContacts.slice(0, 6);

    // 过滤所有没有 name 字段的
    tempContacts = $.map(tempContacts, function (obj) {
        if (obj.name) {
            return obj;
        }
    });


    self.contactsBook.contacts = tempContacts;

    local.addData("SCOPE_CONTACTS_BOOK", self.contactsBook);
    self.update();
}

ContactsBook.prototype.defaults = function (person) {
    var self = this;

    if (!person) {
        return self.contactsBook.defaultContacts;
    }

    self.contactsBook.defaultContacts = person;
    self.add([person]);
}

ContactsBook.prototype.all = function () {
    var self = this;

    return self.contactsBook.contacts;
}

ContactsBook.prototype.update = function () {
    var data = local.getData("SCOPE_CONTACTS_BOOK")
        || '{"contacts":[]}';

    if (data) {
        this.contactsBook = JSON.parse(data);
    }
}

module.exports = new ContactsBook();

});