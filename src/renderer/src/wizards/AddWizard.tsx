import {Box, Button} from "@mui/material";

function AddWizard(): JSX.Element {
  return (
    <Box>
      <Button
        variant="contained"
        onClick={(): void => {
          // @ts-ignore
          window.api.CompleteWizard({
            payload: JSON.stringify({ value: 'ebalo' }),
            success: true
          })
        }}
      >
        Закрыть визард
      </Button>
    </Box>
  )
}

export default AddWizard
