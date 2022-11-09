
function SendCmd()
{
   function cb( dat )
   {
      console.log( "callback" );
      console.log( dat );

      if( dat.error != "0" )
         $("#rsp").html( "Error: " + dat.error );
      else if( dat.data.length < 1 )
         $("#rsp").html( "Success.  No data returned." );
      else
      {
         let S = ''
         let i;
         for( i=0; i<dat.data.length-1; i++ )
            S += dat.data[i] + ', '
         S += dat.data[i]
         $("#rsp").html( S )
      }
   }

   let op = $("#op").val();
   let data = $("#data").val();

   $.getJSON( "_cmd", {type: "binary", cmd: op, data: data }, cb );
}

