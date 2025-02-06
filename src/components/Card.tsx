import React, { type PropsWithChildren } from 'react';
import { Box } from '../native_blocks/primatives/Box';
import { withStyle } from '../native_blocks/hoc/WithStyle';

type CardProps = {
    height: number
    style?: {}
    children?: React.ReactNode
}

const _Card = (props: CardProps) => {
    return (
        <Box flexMain={false} align="flex-start" m={20} mAll={{t: 5}} style={props.style} p={4}  height={props.height}  >
            {props.children}
        </Box>
    )
}


const makeCardStyle = (theme: any) => {
    return {
      style: {
        backgroundColor: theme.secondaryBackground!,
        elevation: 8,
        borderRadius: 5,
      },
    };
  };
  
  export const Card = withStyle<CardProps>(
        _Card,
        makeCardStyle
  );