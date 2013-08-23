'use strict';

function Gist( $, $content )
{

  var DROPBOX_BASE_URL = 'https://dl.dropboxusercontent.com/u/';
  var DEFAULT_SOURCE = '5897167';
  var VALID_GIST = /^[0-9a-f]{5,32}\/?$/;

  var LOCAL_DOCUMENT_SOURCE_ROOT = 'https://github.com/nawroth/docgist/tree/master/gists/';
  var LOCAL_DOCUMENT_EXTENSION = '.adoc';

  return {
    'getGistAndRenderPage' : getGistAndRenderPage,
    'readSourceId' : readSourceId
  };

  function getGistAndRenderPage( renderer )
  {
    var id = window.location.search;
    if ( id.length < 2 )
    {
      id = DEFAULT_SOURCE;
    }
    else
    {
      id = id.substr( 1 );
    }
    var fetcher = fetchGithubGist;
    if ( id.length > 8 && id.substr( 0, 8 ) === 'dropbox-' )
    {
      fetcher = fetchDropboxFile;
      id = id.substr( 8 );
    }
    else if ( !VALID_GIST.test( id ) )
    {
      if ( id.indexOf( '%3A%2F%2F' ) !== -1 )
      {
        fetcher = fetchAnyUrl;
      }
      else
      {
        fetcher = fetchLocalSnippet;
      }
    }
    fetcher( id, renderer, function( message )
    {
      errorMessage( message, id );
    } );
  }

  function readSourceId( event )
  {
    var $target = $( event.target );
    if ( event.which === 13 || event.which === 9 )
    {
      event.preventDefault();
      $target.blur();
      var gist = $.trim( $target.val() );
      if ( gist.indexOf( '/' ) !== -1 )
      {
        var baseLen = DROPBOX_BASE_URL.length;
        if ( gist.length > baseLen && gist.substr( 0, baseLen ) === DROPBOX_BASE_URL )
        {
          gist = 'dropbox-' + encodeURIComponent( gist.substr( baseLen ) );
        }
        else
        {
          var pos = gist.lastIndexOf( '/' );
          var endOfUrl = gist.substr( pos + 1 );
          if ( gist.indexOf( '://' ) !== -1 && !VALID_GIST.test( endOfUrl ) )
          {
            gist = encodeURIComponent( gist );
          }
          else
          {
            gist = endOfUrl;
          }
        }
      }
      if ( gist.charAt( 0 ) === '?' )
      {
        // in case a GraphGist URL was pasted by mistake!
        gist = gist.substr( 1 );
      }
      window.location.assign( '?' + gist );
    }
  }

  function fetchGithubGist( gist, success, error )
  {
    if ( !VALID_GIST.test( gist ) )
    {
      error( 'The gist id is malformed: ' + gist );
      return;
    }

    var url = 'https://api.github.com/gists/' + gist.replace( "/", "" );
    $.ajax( {
      'url' : url,
      'success' : function( data )
      {
        var file = data.files[Object.keys( data.files )[0]];
        var content = file.content;
        var link = data.html_url;
        success( content, link );
      },
      'dataType' : 'json',
      'error' : function( xhr, status, errorMessage )
      {
        error( errorMessage );
      }
    } );
  }

  function fetchDropboxFile( id, success, error )
  {
    var url = DROPBOX_BASE_URL + decodeURIComponent( id );
    $.ajax( {
      'url' : url,
      'success' : function( data )
      {
        success( data, url );
      },
      'dataType' : 'text',
      'error' : function( xhr, status, errorMessage )
      {
        error( errorMessage );
      }
    } );
  }

  function fetchAnyUrl( id, success, error )
  {
    var url = decodeURIComponent( id );
    $.ajax( {
      'url' : url,
      'success' : function( data )
      {
        success( data, url );
      },
      'dataType' : 'text',
      'error' : function( xhr, status, errorMessage )
      {
        error( errorMessage );
      }
    } );
  }

  function fetchLocalSnippet( id, success, error )
  {
    var url = './gists/' + id + '.adoc';
    $.ajax( {
      'url' : url,
      'success' : function( data )
      {
        var link = LOCAL_DOCUMENT_SOURCE_ROOT + id + LOCAL_DOCUMENT_EXTENSION;
        success( data, link );
      },
      'dataType' : 'text',
      'error' : function( xhr, status, errorMessage )
      {
        error( errorMessage );
      }
    } );
  }

  function errorMessage( message, gist )
  {
    var messageText;
    if ( gist )
    {
      messageText = 'Something went wrong fetching the GraphGist "' + gist + '":<p>' + message + '</p>';
    }
    else
    {
      messageText = '<p>' + message + '</p>';
    }

    $content.html( '<div class="alert alert-block alert-error"><h4>Error</h4>' + messageText + '</div>' );
  }
}
