const Checkbox =  {
    defaultProps: {
        bg: "nord.secondaryBackground",
        borderColor: "nord.primary.1",
        _icon:{
        color: "#ffffff"
        },
        _text: {
        color: 'black',
        mr: 2,
        },
        _checked:{
        bg: "nord.primary.1",
        borderColor: "nord.primary.1",
        _pressed: {
            borderColor: "nord.primary.1",
            bg: "nord.primary.1",
        },
        },
        _pressed: {
        borderColor: "nord.primary.1",
        bg: "nord.primary.1",
        },
        //colorScheme: 'red',

        _stack: {
        direction: 'row',
        alignItems: 'center',
        space: 0,
        }
    },
  }

  export default Checkbox