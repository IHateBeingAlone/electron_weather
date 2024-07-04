/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { ICity } from '../interfaces/data'

function MainWindow(): JSX.Element {
  const [data, setData] = useState<ICity[]>([])

  function makeData(addWizardResponse: string): Partial<ICity> {
    const responseParsed = JSON.parse(addWizardResponse).value

    const newCity: Partial<ICity> = {}
    newCity.name = responseParsed.name
    newCity.latitude = responseParsed.latitude
    newCity.longtitude = responseParsed.longtitude

    return newCity
  }

  return (
    <Box>
      <Box>
        <Button
          variant="contained"
          onClick={(): void => {
            // @ts-ignore
            window.api.LaunchWizard('addWizard').then((response) => {
              if (response.success == true) {
                setData((prev) => {
                  const copy = [...prev]
                  copy.push(makeData(response.payload) as ICity)
                  return copy
                })
              }
            })
          }}
        >
          Добавить город
        </Button>
      </Box>
      <Box>
        {data.length > 0 &&
          data.map((item, key) => {
            return (
              <Box key={key}>
                <Typography>Название: {item.name}</Typography>
                <Typography>Широта: {item.latitude}</Typography>
                <Typography>Долгота: {item.longtitude}</Typography>
              </Box>
            )
          })}
      </Box>
    </Box>
  )
}

export default MainWindow
