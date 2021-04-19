window.addEventListener('DOMContentLoaded', function(event) {
  console.log('DOM fully loaded and parsed');
  websdkready();
});

function websdkready() {
  var testTool = window.testTool;
  if (testTool.isMobileDevice()) {
    vConsole = new VConsole();
  }
  console.log("checkSystemRequirements");
  console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

  // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
  // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av'); // CDN version default
  // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.9.1/lib', '/av'); // china cdn option
  // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
  ZoomMtg.preLoadWasm(); // pre download wasm file to save time.

  const params = new URLSearchParams(window.location.search);
  let mn = params.get("mn");
  let pw = params.get("pw");
  let name = params.get("name");
  let ap = params.get("ap");

  ZoomMtg.i18n.load("fr-FR");
  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();

  const API_KEY_ARR = {
	"demo2.salonvirtuel.space":"CAJ1vOJNQ4-iK3bw7rOxJw",
	"demo3.salonvirtuel.space":"nQLovxVtRiepend_FnhO_A",
  "112expo.fr":"RA7s8OO7QKqsUmINLoCT2w",
	"icya-iaas.org":"CAJ1vOJNQ4-iK3bw7rOxJw",
  };
  const API_KEY = API_KEY_ARR[ap];
  // const API_KEY = "CAJ1vOJNQ4-iK3bw7rOxJw";

  if (name !== null) {
    $("#display_name").val(name);
  }

  document.getElementById("join_meeting").addEventListener("click", (e) => {
    e.preventDefault();

    let apiKey = API_KEY;
    let sign = "";
    // let role = document.getElementById("meeting_role").value;
    let role = 0;

    let userName = document.getElementById("display_name").value;

    if (userName !== "") {
      document.getElementById("join_meeting").style.display = "none";
      document.getElementById("loader").style.display = "block";
    }

    // replace with App url
    fetch("https://"+ap+"/api/zoom/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
      body: JSON.stringify({
        meeting_number: mn,
        role: role,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // GOT SIGNATURE
        sign = data;

        // INIT and Join Meeting
        ZoomMtg.init({
          leaveUrl: "./",
          isSupportAV: true,
          success: function () {
            ZoomMtg.join({
              signature: sign,
              meetingNumber: mn,
              userName: userName,
              apiKey: apiKey,
              userEmail: "Admin@SAS.com",
              passWord: pw,
              success: (success) => {
                document.getElementById("connexion").style.display = "none";
                document.getElementById("nav-tool").style.background = "none";
                $("#nav-tool").css("background", "none !important");
                $("#nav-tool").css("height", "0");
                //
                setTimeout(function () {
                  $("#join-pc-audio-btn").html(
                    "Activer l'audio du Périphérique"
                  );
                }, 500);
              },
              error: (error) => {
                console.log(error);

                setTimeout(function () {
                  if (error) {
                    $(".zm-modal-footer").css("display", "none");
                  }

                  $(".ReactModal__Overlay").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (name == null) {
                      location.replace(window.location + "&name=" + userName);
                    } else {
                      location.reload();
                    }
                  });
                }, 300);
              },
            });
          },
        });
      });
  });

}
