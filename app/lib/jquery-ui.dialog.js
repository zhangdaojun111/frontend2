import 'jquery-ui/ui/widgets/dialog';

$.widget( "custom.erdsDialog", $.ui.dialog, {
    _createTitlebar: function() {
        this._super();
        this.uiDialogTitlebarFull = $( "<button type='button' title='全屏'></button>" )
            .button( {
                label: '',
                // icon: "ui-icon-newwin",
                icon:"icon-maximize",
                showLabel: false
            } )
            .appendTo( this.uiDialogTitlebar );
        let that = this;
        this._addClass( this.uiDialogTitlebarFull, "ui-dialog-titlebar-full" );
        this._on( this.uiDialogTitlebarFull, {
            click: function( event ) {
                event.preventDefault();
                if (this.fullScreen === true) {
                    this.option('width', this.options.originWidth);
                    this.option('height', this.options.originHeight);
                    this.option('position', { my: "center", at: "center", of: window });
                    this.fullScreen = false;

                    that._removeClass($(that.uiDialogTitlebarFull[0].firstChild),"ui-icon-newwin");
                    that._addClass($(that.uiDialogTitlebarFull[0].firstChild),"icon-maximize");
                } else {
                    this.options.originHeight = this.options.height;
                    this.options.originWidth = this.options.width;
                    this.option('width', document.documentElement.clientWidth);
                    this.option('height', document.documentElement.clientHeight);
                    this.option('position', { my: "center", at: "center", of: window });
                    this.fullScreen = true;

                    that._removeClass($(that.uiDialogTitlebarFull[0].firstChild),"icon-maximize");
                    that._addClass($(that.uiDialogTitlebarFull[0].firstChild),"ui-icon-newwin");
                }
            }
        } );
    }
});



