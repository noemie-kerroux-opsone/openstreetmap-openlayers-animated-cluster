<!DOCTYPE html>
<html>
<head>
    <title>OpenLayers et Animated Cluster</title>
    <style>
        html, body {
            padding: 0px;
            margin: 0px;
            font-family: Verdana, Arial;
        }
        h1 {
            margin: 0px;
            font-size: 40px;
            line-height: 60px;
            text-align: center;
            width: 100%;
        }
        #map {
            width: 100%;
            height: 100vh;
        }
        div#mappopup_contentDiv.olPopupContent .title {
            margin-bottom: 10px;
            color: rgb(247, 49, 67);
            font-weight: bold;
            font-size: 22px;
        }
        div#mappopup_contentDiv.olPopupContent .text {
            line-height: 26px;
            margin: 0px;
        }
        #map .olPopup#mappopup {
            -webkit-transform: translate(-50%, calc(-100% - 60px));
            -o-transform: translate(-50%, calc(-100% - 60px));
            transform: translate(-50%, calc(-100% - 60px));
            overflow: visible !important;
            box-shadow: 0px 0px 15px 0px rgba(10,10,10,0.2);
            width: 240px !important;
            height: 140px !important;
            border-radius: 3px;
        }
        #map .olPopup:after {
            content: "";
            display : block;
            height : 0;
            width : 0;
            border-top : 15px solid white;
            border-right : 15px solid transparent;
            border-left : 15px solid transparent;
            margin: 0 auto;
            position: absolute;
            left: calc(50% - 15px);
            bottom: -15px;
        }
        #map .olPopup .olPopupContent {
            padding: 20px !important;
            width: calc(100% - 40px) !important;
            height: 100px !important;
        }
        div#mappopup_close.olPopupCloseBox {
            background-image: url(images/close.png);
            background-size: 12px auto;
            background-position: center;
            top: 0px !important;
            right: 0px !important;
            width: 32px !important;
            height: 32px !important;
        }
        div#OpenLayers_Control_Attribution_7.olControlAttribution.olControlNoSelect {
            display: none;
        }

    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script src="AnimatedCluster.js"></script>
    <script src="map.js"></script>
</body>
</html>
