import 'jquery-ui/ui/widgets/dialog';

$.widget("custom.erdsDialog", $.ui.dialog, {
    options: {
        closeText: "关闭",
    },
    open: function () {
        this._super();
        if (this.options.defaultMax === true) {
            this._maximizeWindow();
        }
        if (this.options.customSize === true) {
            this._customWindow();
        }
        if (this.options.closable === false) {
            this.uiDialogTitlebarClose.hide();
            if (this.uiDialogTitlebarFull) {
                this.uiDialogTitlebarFull.css({
                    right: '0.3em'
                });
            }
        }
        return this;
    },

    _customWindow: function () {
        let width = Math.max(400, document.documentElement.clientWidth);
        let height = Math.max(400, document.documentElement.clientHeight - 180);
        this.option('width', width);
        this.option('height', height);
        this.option('position', {my: "center", at: "center", of: window});
        this.fullScreen = false;
        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "ui-icon-newwin");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
        }
    },

    _maximizeWindow: function () {
        let width = Math.max(400, document.documentElement.clientWidth);
        let height = Math.max(400, document.documentElement.clientHeight);
        this.options.originHeight = this.options.height;
        this.options.originWidth = this.options.width;
        this.option('width', width);
        this.option('height', height);
        this.option('position', {my: "center", at: "center", of: window});
        this.fullScreen = true;
        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "ui-icon-newwin");
        }
    },
    _minimizeWindow: function () {
        this.option('width', this.options.originWidth);
        this.option('height', this.options.originHeight);
        this.option('position', {my: "center", at: "center", of: window});
        this.fullScreen = false;
        if (this.uiDialogTitlebarFull) {
            this._removeClass($(this.uiDialogTitlebarFull[0].firstChild), "ui-icon-newwin");
            this._addClass($(this.uiDialogTitlebarFull[0].firstChild), "icon-maximize");
        }

    },
    _createTitlebar: function () {
        this._super();
        if (this.options.maxable === true) {
            this.uiDialogTitlebarFull = $("<button type='button' title='全屏'></button>")
                .button({
                    label: '',
                    icon: "icon-maximize",
                    showLabel: false
                })
                .appendTo(this.uiDialogTitlebar);
            this._addClass(this.uiDialogTitlebarFull, "ui-dialog-titlebar-full");
            this._on(this.uiDialogTitlebarFull, {
                click: function (event) {
                    event.preventDefault();
                    if (this.fullScreen === true) {
                        this._minimizeWindow();
                    } else {
                        this._maximizeWindow();
                    }
                }
            });
        }
    }
});



