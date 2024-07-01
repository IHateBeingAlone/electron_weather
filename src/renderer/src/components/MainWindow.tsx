import {Box, Button} from "@mui/material";

function MainWindow(): JSX.Element {
  return (
    <Box>
      <Button
        variant="contained"
        onClick={(): void => {
          // @ts-ignore
          window.api.LaunchWizard('addWizard').then((response) => {
            console.log(response)
          })
        }}
      >
        Открыть визард
      </Button>
    </Box>
  )
}

export default MainWindow
