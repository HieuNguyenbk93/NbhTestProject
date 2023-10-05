/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Created by Dima Portenko on 05.07.2021
 */
import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {
  ProcessImageNavigationProps,
  ProcessImageRouteProps,
} from '../navigation/Navigator';
import {recognizeImage, Response} from '../mlkit';
import {ResponseRenderer} from '../components/ResponseRenderer';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

export const ProcessImageScreen = ({route}: ProcessImageScreenProps) => {
  const {width: windowWidth} = useWindowDimensions();
  const [aspectRatio, setAspectRation] = useState(1);
  const [response, setResponse] = useState<Response | undefined>(undefined);
  const uri = route.params.uri;

  useEffect(() => {
    if (uri) {
      proccessImage(uri);
    }
  }, [uri]);

  const proccessImage = async (url: string) => {
    if (url) {
      try {
        const response = await recognizeImage(url);
        console.log(response);
        if (response?.blocks?.length > 0) {
          setResponse(response);
          setAspectRation(response.height / response.width);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ScrollView style={{flex: 1}}>
      <Image
        source={{uri}}
        style={{width: windowWidth, height: windowWidth * aspectRatio}}
        resizeMode="cover"
      />
      {!!response && (
        <ResponseRenderer
          response={response}
          scale={windowWidth / response.width}
        />
      )}
    </ScrollView>
  );
};
