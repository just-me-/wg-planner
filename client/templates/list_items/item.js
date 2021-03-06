Template.item.helpers({
  short : function () {
    // 2do add icons
    var user = Meteor.users.findOne(this.userId);
    return user.profile.first_name.charAt(0) + user.profile.last_name.charAt(0);
    // return this.creator.substring(0,2);
  }
});

Template.item.events({
  'click li .tick': function( e ) { // only click on tick; not whole entry
    e.stopPropagation();
    Items.update( { _id: this._id }, { $set: { checked: !this.checked } } );
    if ( this.checked ) {
      showMessage( 'unchecked', 'Artikel nicht gekauft' );
    } else {
      showMessage( 'check', 'Artikel gekauft' );
    }
  },
  'click a.btn-important': function( e ) {
    e.stopPropagation();
    Items.update( { _id: this._id }, { $set: { important: !this.important } } );
    showMessage( 'fire', 'Artikel ist ' + (!this.important ? '' : 'nicht ') + 'dringlich' );
  },
  'click a.btn-delete': function( e ) {
    e.stopPropagation();
    if ( confirm( 'Möchtest Du diesen Artikel löschen?' ) ) {
      Items.remove( { _id: this._id } );
      showMessage( 'remove', 'Artikel gelöscht.' );
    }
  },
  'click input': function( e ) { e.stopPropagation(); },
  'click a.btn-edit, longPress li': function( e ) {
    e.stopPropagation();
    editItem( this );
    return false;
  },
  'blur .edit input': function( e ) {
    // not only on mobile..
    /*
    if ( $( window ).width() >= 768 ) {
      return;
    }
    */

    if ( ( value = $( '#item-' + this._id + ' .edit input' ).val() ) && value != this.title ) {
      Items.update( { _id: this._id }, { $set: { title: value } } );
      showMessage( 'ok', 'Artikel aktualisiert.' );
    }
    editItem( this );
  },
  'keyup .edit input': function( e ) {
    if ( e.which == 13 ) {
      $( '#item-' + this._id + ' .edit input' ).blur();
    }
  }
});

Template.item.rendered = function() {
  // trigger only by pressing title
  var el = this.firstNode.getElementsByClassName('title')[0];
  assignLongPress( el, function() { $( el ).trigger( 'longPress' ); } );
};

var editItem = function( _this ) {
  $( '#item-' + _this._id + ' .btn-edit span' )
    .toggleClass( 'glyphicon-pencil glyphicon-floppy-save text-danger' );
  $( '#item-' + _this._id + ' .title' )
    .toggleClass( 'edit' )
    .find( 'input' ).focus();
}

var assignLongPress = function( el, callback ) {
  $( el )
    .on( 'mousedown touchstart', function ( e ) {
      e.stopPropagation();
      $( this ).data( 'checkdown', setTimeout( callback, 1000 ) );
    }).on( 'mouseup touchend', function ( e ) {
      e.stopPropagation();
      clearTimeout( $( this ).data( 'checkdown' ) );
    }).on( 'mouseout touchleave', function () {
      clearTimeout( $( this ).data( 'checkdown' ) );
    });
}
