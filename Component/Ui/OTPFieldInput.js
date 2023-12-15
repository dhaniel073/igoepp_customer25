import { StyleSheet, Text, View } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import styled from 'styled-components'
import { Color } from './GlobalStyle'

export const HiddenTextInput = styled.TextInput`
    position: absolute;
    width:1px;
    height: 1px;
    opacity: 0;
`;


// border-color: ${Color.darkolivegreen_100};
//     border-width: 2px;
//     border-radius: 5px;
//     padding: 12px;
//     margin-top: 15px;
//     width: 300px;

export const OTPInputSection = styled.View`
    justify-content: center;
    align-items: center;
    margin-vertical: 30px;
`;

export const  OTPInputContainer = styled.Pressable`
    width: 70%;
    flex-direction: row;
    justify-content: space-around;
`;

export const OTPInput = styled.View`
    border-color: ${Color.new_color};
    min-width: 15%;
    border-width: 2px;
    border-radius: 5px;
    padding: 12px;
`;

export const OTPInputText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

export const OTPInputFocused = styled(OTPInput)`
    border-Color: ${Color.darkolivegreen_100};
    background-color: ${Color.mintcream}
`;


const OTPFieldInput = ({setPinReady, code, setCode, maxLength}) => {
    const [maskedText, setMaskedText] = useState('');
    const codeDigitsArray = new Array(maxLength).fill(0)
    // ref for textinput
    const textInputRef = useRef(null)

    //monitoring input focus
    const [inputContainerIsFocused, setinputContainerIsFocused] = useState(false)

    const handleOnPress = () => {
        setinputContainerIsFocused(true)
        textInputRef?.current?.focus()
    };

    const handleBlur = () => {
        setinputContainerIsFocused(false)
    };

    useEffect(() => {
        //updating 
      setPinReady(code.length === maxLength);
      return () => setPinReady(false)
    }, [code])

    const toCodeDigitInput = (_value, index) => {
        const  emptyInputChar = "";
        const digit = code[index] || emptyInputChar
       


        //formating
        const isCurrentDigit =  index === code.length;
        const isLastDigit = index === maxLength - 1;
        const isCodeFull = code.length === maxLength;

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        const StyledOTPInput = inputContainerIsFocused && isDigitFocused ? OTPInputFocused : OTPInput

        return (
            <StyledOTPInput key={index}>
                <OTPInputText>{digit &&  "*"}</OTPInputText>
            </StyledOTPInput>
        )
    }

  return (
    <OTPInputSection>
        <OTPInputContainer onPress={handleOnPress}>
            {codeDigitsArray.map(toCodeDigitInput)}
        </OTPInputContainer>
        <HiddenTextInput
            value={code}
            onChangeText={setCode}
            maxLength={maxLength}
            keyboardType="number-pad"
            returnKeyType="done"
            textContentType="oneTimeCode"
            ref={textInputRef}
            onBlur={handleBlur}
            secureTextEntry={true}
        />
    </OTPInputSection>
  )
}

export default OTPFieldInput

