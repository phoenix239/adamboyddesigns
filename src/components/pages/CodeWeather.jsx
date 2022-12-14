import React, { useState } from 'react';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { useEffect } from 'react';

import apiKeys from '../apiKeys';

import {
  Button,
  Heading,
  Label,
  Link,
  PageTitleFrame,
  Spacer,
} from '../../components';

const WeatherCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  padding: 0 1rem 1rem;
  width: 30%;
  box-shadow: 0px 0px 10px 0px ${palette('grayscale', 4)};
  margin: 2rem 0 1rem;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid ${palette('grayscale', 4)};
  background-color: ${palette('primary', 3)};
  width: 100%;
  align-self: center;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0px 0px 5px 0px ${palette('grayscale', 4)};
`;

const HeaderLabel = styled(Label)`
  align-self: center;
`;

const StyledHeading = styled(Heading)`
  margin: 0 0.5rem 0.5rem;
  align-self: center;
`;

const StyledLocation = styled(Label)`
  font-size: 0.8rem;
  margin: 0 0.5rem;
  align-self: center;
`;

const StyledIconLabel = styled(Label)`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  text-transform: capitalize;
  margin: 1rem 0 0.5rem -1rem; ;
`;

const TempWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  padding: 0 0 2rem;
  border-bottom: 1px solid ${palette('grayscale', 5)};
  width: 90%;
`;

const StyledTemp = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StyledFeels = styled(Label)`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
`;

const StyledMaxMin = styled(Label)`
  font-size: 0.8rem;
`;

const WeatherIcon = styled.img`
  max-width: 50px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${palette('grayscale', 5)};
  width: 90%;
`;

const StyledInfoLabel = styled(Label)`
  font-size: 0.8rem;
`;

const StyledSwapButton = styled(Button)`
  max-width: 70%;
  align-self: center;
  margin: 1.5rem 0 0.5rem;
`;

const StyledRefresh = styled(Button)``;

const APICredit = styled(Link)`
  font-size: 0.8rem;
  margin: 0.3rem;
`;

const CodeWeather = () => {
  const [weather, setWeather] = useState();
  const [loaded, setLoaded] = useState(false);
  const [tempCelsius, setTempCelsius] = useState(false);
  const appId = apiKeys.codeWeather.appid;

  // NOTE: Less accurate location fetch method
  function fetchWeather() {
    fetch(`https://ipapi.co/json/`)
      .then((response) => response.json())
      .then((position) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${appId}`
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.cod === 200) {
              setWeather(result);
              setLoaded(true);
            } else {
              setLoaded(false); // Used for refresh where already set to true
            }
          })
          .catch((error) => {
            console.error();
          });
      })
      .catch(() => {});
  }

  // NOTE: Requires HTTPS and Certificate
  // function fetchWeather() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       fetch(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${appId}`
  //       )
  //         .then((response) => response.json())
  //         .then((result) => {
  //           if (result.cod === 200) {
  //             setWeather(result);
  //             setLoaded(true);
  //           } else {
  //             setLoaded(false); // Used for refresh where already set to true
  //           }
  //         })
  //         .catch((error) => {
  //           console.error();
  //         });
  //     });
  //   } else {
  //     alert('Geolocation is not supported by this browser.');
  //   }
  // }

  // Kelvin to Fahrenheit T(K) ?? 9/5 - 459.67
  function fTemp(temp) {
    return Math.floor((temp * 9) / 5 - 459.67);
  }

  // Kelvin to Celsius T(K) - 273.15
  function cTemp(temp) {
    return Math.floor(temp - 273.15);
  }

  const handleClick = () => {
    fetchWeather();
  };

  const handleTempSwap = () => {
    setTempCelsius(!tempCelsius);
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTitleFrame title='Weather App Project' noBottomRule>
      {!loaded && (
        <>
          <Spacer padding={1} />
          <Label>OOPS! Something went wrong!</Label>
          <Label>
            Please make sure to allow this page to know your location!
          </Label>
        </>
      )}
      {loaded && (
        <WeatherCard>
          <StyledHeader>
            <HeaderLabel>Weather for:</HeaderLabel>
            <StyledHeading>{`${weather?.name}`}</StyledHeading>
            <StyledLocation>{`${weather?.coord?.lat} Lat., ${weather?.coord?.lon} Lon.`}</StyledLocation>
          </StyledHeader>
          <StyledIconLabel>
            <WeatherIcon
              src={`http://openweathermap.org/img/w/${
                weather?.weather?.at(0)?.icon
              }.png`}
            />
            {`${weather?.weather?.at(0)?.description}`}
          </StyledIconLabel>
          <TempWrapper>
            <StyledTemp>
              {tempCelsius ? (
                <>{`${cTemp(weather?.main?.temp)}??C`}</>
              ) : (
                <>{`${fTemp(weather?.main?.temp)}??F`}</>
              )}
            </StyledTemp>
            <StyledFeels>
              {tempCelsius ? (
                <>{`Feels Like: ${cTemp(weather?.main?.feels_like)}??C`}</>
              ) : (
                <>{`Feels Like: ${fTemp(weather?.main?.feels_like)}??F`}</>
              )}
            </StyledFeels>
            {tempCelsius ? (
              <StyledMaxMin>{`Min: ${cTemp(
                weather?.main?.temp_min
              )}??C, Max: ${cTemp(weather?.main?.temp_max)}??C`}</StyledMaxMin>
            ) : (
              <StyledMaxMin>{`Min: ${fTemp(
                weather?.main?.temp_min
              )}??F, Max: ${fTemp(weather?.main?.temp_max)}??F`}</StyledMaxMin>
            )}
          </TempWrapper>
          <InfoWrapper>
            <StyledInfoLabel>{`Humidity: ${weather?.main?.humidity}%`}</StyledInfoLabel>
            <StyledInfoLabel>{`Pressure: ${weather?.main?.pressure}??`}</StyledInfoLabel>
            <StyledInfoLabel>{`Wind Speed: ${weather?.wind?.speed}km/h`}</StyledInfoLabel>
          </InfoWrapper>
          <StyledSwapButton onClick={handleTempSwap} variant='primary'>
            {tempCelsius ? 'Show in Fahrenheit' : 'Show in Celsius'}
          </StyledSwapButton>
        </WeatherCard>
      )}
      <Spacer padding={2} />
      <StyledRefresh onClick={handleClick} variant='ghost' buttonHeight={1.5}>
        {loaded ? 'Refresh' : 'Load Weather'}
      </StyledRefresh>
      <Spacer padding={2} />
      <APICredit href={'https://ipapi.co/'} target='_blank'>
        Location API courtesy of ipapi (If your location isn't right, I blame
        them.)
      </APICredit>
      <APICredit href={'https://openweathermap.org/'} target='_blank'>
        Weather API courtesy of OpenWeather
      </APICredit>
      <Spacer padding={2} />
    </PageTitleFrame>
  );
};

export default CodeWeather;
