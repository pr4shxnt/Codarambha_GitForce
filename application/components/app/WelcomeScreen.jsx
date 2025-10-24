import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  View,
  NativeModules,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import "../../global.css";
import Icon from 'react-native-vector-icons/FontAwesome';
import {ChevronDown, ChevronRight, ChevronUp} from "lucide-react-native"

const { HceModule } = NativeModules;

export default function WelcomeScreen() {
  const [payload, setPayload] = useState('DGSVS343WE3XIA22ESDCDSDSV.  ');
  const [defaultLang, setDefaultLang] = useState({
    label: 'English',
    value: 'en',
  });
  const [langModel, setLangModel] = useState(false);

  console.log(defaultLang);
  console.log(langModel);
  const languages = [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Nepali',
      value: 'np',
    },
  ];

  // useEffect(() => {
  //   HceModule.sendPayload(payload);
  // }, [payload]);

  return (
    <View className="flex-1">
      <View className="flex-1">
        <View className="flex-1 items-center justify-between bg-white p-4">
          <View>
            <Image
              source={require('../assets/apppicon.png')}
              className="mt-12 h-52 w-52 self-center rounded-xl"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => {
                setLangModel(!langModel);
                console.log(langModel);
              }}
              className="mb-2 w-[60%] flex-row items-center justify-between rounded-full bg-gray-100 p-5 px-7"
            >
              <View>
                <Text className="text-xl font-semibold">
                  {defaultLang.label}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View>
                  <Text className="text-xl font-light">
                    {defaultLang.value}
                  </Text>
                </View>
                {langModel ? (
                  <ChevronUp/>
                ) : (
                  <ChevronDown/>)}
              </View>
            </TouchableOpacity>
          </View>

          <View className="items-center justify-center pb-12">
            <TouchableOpacity className="mb-2 h-24 w-24 flex-row items-center justify-center rounded-full bg-blue-500 p-10">
                    <ChevronRight size={30} color="white"/>
                </TouchableOpacity>
            <Text className="text-center text-black">Continue</Text>
          </View>
        </View>
      </View>
      {langModel && (
        <View className="absolute inset-0 top-1/2 h-auto rounded-t-[40px]  bg-blue-50 shadow-2xl">
          <Text className="pt-16 text-center text-2xl font-bold tracking-wide text-gray-500">
            Select a Language:
          </Text>
          <View className="mt-20 h-full flex-col items-center gap-5">
            {languages.map(lang => {
              return (
                <View key={lang.value} className="w-[90%]">
                  <TouchableOpacity
                    onPress={() => {
                      setDefaultLang(lang);
                      setLangModel(false);
                    }}
                    className="flex-row items-center justify-center gap-x-4 border-b-[0.5px] border-black bg-blue-50  px-20 py-4  "
                  >
                    <Text className=" text-xl font-semibold text-gray-500">
                      {lang.label}
                    </Text>
                    <Text className=" text-xl font-semibold text-gray-500">
                      ({lang.value})
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}