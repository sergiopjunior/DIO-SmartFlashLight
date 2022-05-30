import React, {useState, useEffect} from "react";
import {
    View,
    Image,
    Button,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Text,
    Pressable,
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
const light_modes = {
    1: "Normal",
    2: "Pisca-Pisca",
    3: "LSD",
};

const main_bg_color = "rgba(0, 0, 0, 0.774)";
const text_color = "white";
const button_color = "#841584";
const flashlight_off = "../assets/icons/eco-light-off.png";
const flashlight_on = "../assets/icons/eco-light.png";

var flashlight_mode = 1;
var light_on = false;
var ids = [0, 1];

function normalize(size){
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  };

async function make_light(){
    light_on = !light_on;
    console.log(`Light Change: ${light_on}`);
};

function mode_change(){
    flashlight_mode = flashlight_mode < Object.keys(light_modes).length ? flashlight_mode + 1 : 1;
    Alert.alert(`Modo da lanterna alterado para ${light_modes[flashlight_mode]}`)
};

const App = () => {

    const [light, setLight] = useState(light_on);
    const [isActive, setIsActive] = useState(false);
    const handleChangeLight = () => setLight(light_on);
    var timers = {0: {"run": false, "func": make_light, "time": 1000, "timerID": 0}, 1: {"run": false, "func": () => setLight(light_on), "time": 500, "timerID": 1}};
    

    const toggleOnOff = () => {
        setIsActive(!isActive);
        console.log(`On/Off: ${isActive}`);
      }

      useEffect(() => {
        console.log(`useEffect: ${isActive}`);
        for (let i = 0; i < Object.keys(timers).length; i++) {
            if (isActive)
            {
                if (!timers[i]["run"]) {
                    var timerID = BackgroundTimer.setInterval(() => timers[i]["func"](), timers[i]["time"]);
                    // timers[i]["timerID"] = timerID;
                    ids[i] = timerID;
                    timers[i]["run"] = true;
                    console.log(`Run timer: ${timerID}`);
                }
            }
            if (!isActive)
            {
                console.log(`Clear timer: ${ids[i]}`);
                BackgroundTimer.clearInterval(ids[i]);
                timers[i]["run"] = false;              
            }
            console.log(timers[i]);
        }
      }, [isActive]);

    return (
        <SafeAreaView style={style.main}>
            <StatusBar backgroundColor={main_bg_color}/>
            <View style={[style.container, style.header]}>
            <TouchableOpacity style={style.button} onPress={() => mode_change()}>
                <Text style={style.h1}>Mudar modo da Lanterna</Text>
            </TouchableOpacity>
            </View>
            <View style={[style.container, style.body]}>
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
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
    },
    main: {
        backgroundColor: main_bg_color,
        flex: 1,
        flexDirection: "column",
    },   
    header: {
        backgroundColor: "black",
        width: "100%",
        height: "30%",
        alignItems: "center",
    },
    body: {
        backgroundColor: button_color,
        width: "100%",
        height: "100%",
        padding: 20,
    },
    h1: {
        color: text_color,
        fontSize: normalize(20),
    },
    button: {
        alignItems: 'center',
        backgroundColor: button_color,
        padding: 10,
    },
    flashlight: {
        resizeMode: "contain",
        width: normalize(150),
        height: normalize(150),
    },
});