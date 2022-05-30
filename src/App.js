import React, {useState, useEffect} from "react";
import {
    View,
    Image,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Text,
    Linking,
    Dimensions, 
    Platform, 
    PixelRatio,
    Alert,
    TouchableOpacity
  } from 'react-native';
import BackgroundTimer from "react-native-background-timer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
const main_bg_color = "rgba(0, 0, 0, 0.774)";
const text_color = "white";
const button_color = "rgba(0, 0, 0, 0.774)";
const flashlight_off = "../assets/icons/eco-light-off.png";
const flashlight_on = "../assets/icons/eco-light.png";
const light_modes = {1: {"mode": "Normal"}, 2: {"mode": "Pisca-Pisca"}, 3: {"mode": "LSD"}};
var flashlight_mode = 3;
var light_on = false;
var timers = {0: {"run": false, "func": make_light, "time": 200, "timerID": 0}, 1: {"run": false, "func": null, "time": 200, "timerID": 1}};
var last_tick = 0;

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
};

function normalize(size){
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};

function normal_mode() {
    if (!light_on) {
        light_on = true;
        // console.log(`Light Change: ${light_on}`);
    }
};

function pisca_pisca() {
    var tick = ((new Date().getTime() - last_tick) / 1000);
    if (tick >= 1) {
        if (light_on){
            light_on = false;
            last_tick = new Date().getTime();
            //console.log(`Light Change: ${light_on}`);
        }
        else {
            light_on = true;
            last_tick = new Date().getTime();
            //console.log(`Light Change: ${light_on}`);
        }
    }
};

function LSD() {
    var tick = ((new Date().getTime() - last_tick) / 1000);
    if (light_on && tick >= getRandom(0, 0.01)){
        light_on = false;
        last_tick = new Date().getTime();
        //console.log(`Light Change: ${light_on}`);
    }
    else if (!light_on && tick >= getRandom(0, 0.01)) {
        light_on = true;
        last_tick = new Date().getTime();
        //console.log(`Light Change: ${light_on}`);
    }
}

function make_light(){
    switch (flashlight_mode) {
        case 1:
            normal_mode();
        break;
        case 2:
            pisca_pisca();
        break;
        case 3:
            LSD();
        break;
        default:
            light_on = false;
    }
    
};

function mode_change(){
    flashlight_mode = flashlight_mode < Object.keys(light_modes).length ? flashlight_mode + 1 : 1;
    //Alert.alert(`Modo da lanterna alterado para ${light_modes[flashlight_mode]["mode"]}`)
};

const App = () => {
    const [light, setLight] = useState(light_on);
    const [isActive, setIsActive] = useState(false);
    const [lightMode, setLightMode] = useState(light_modes[flashlight_mode]["mode"])
    const handleModeChange = () => setLightMode(light_modes[flashlight_mode]["mode"]);
    const handleChangeLight = () => setLight(light_on);
    const toggleOnOff = () => {setIsActive(!isActive); light_on = false;};
    timers[1]["func"] = () => handleChangeLight();
    
    useEffect(() => {
        for (let i = 0; i < Object.keys(timers).length; i++) {
            if (isActive && !timers[i]["run"])
            {
                timers[i]["timerID"] = BackgroundTimer.setInterval(() => timers[i]["func"](), timers[i]["time"]);
                timers[i]["run"] = true;
                console.log(`Run timer: ${timers[i]["timerID"]}`);
            }
            else if (!isActive && timers[i]["run"])
            {         
                BackgroundTimer.clearInterval(timers[i]["timerID"]);
                timers[i]["run"] = false;   
                console.log(`Clear timer: ${timers[i]["timerID"]}`);                  
            }
        }
      }, [isActive]);

    return (
        <SafeAreaView style={style.main}>
            <StatusBar backgroundColor={main_bg_color}/>
            <View style={[style.container, style.header]}>
                <TouchableOpacity style={style.button} onPress={() => {mode_change(); handleModeChange()}}>
                    <Text style={style.h1}>Mudar modo da Lanterna</Text>
                </TouchableOpacity>
                <Text style={style.h1}>{lightMode}</Text>
            </View>
            <View style={style.body}>
                <TouchableOpacity style={style.flashlight} onPress={toggleOnOff}>
                    <Image source={light && isActive ? require(flashlight_on) : require(flashlight_off)} style={style.flashlight}></Image>
                </TouchableOpacity>
            </View>       
        </SafeAreaView>
    );
  };

export default App;

const style = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
    },
    main: {
        backgroundColor: main_bg_color,
        flex: 1,
        flexDirection: "column",
    },   
    header: {
        //backgroundColor: "black",
        width: "100%",
        height: "30%",
        alignItems: "center",
    },
    body: {
        //backgroundColor: button_color,
        width: "100%",
        height: "100%",
        padding: 20,
    },
    h1: {
        color: text_color,
        fontSize: normalize(20),
    },
    button: {
        backgroundColor: button_color,
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
    },
    flashlight: {
        resizeMode: "contain",
        width: normalize(150),
        height: normalize(150),
        alignSelf: "center",
    },
});