import {
  Checkbox,
  Container,
  Divider,
  Flex,
  Group,
  NumberInput,
  Radio,
  Stack,
  Switch,
  Tooltip,
  UnstyledButton
} from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { ThemeProvider } from "~theme"

function Popup() {
  const [toggle, setToggle] = useState(false)
  const [minuteInterval, setMinuteInterval] = useState<number | "">(0)
  const [secondInterval, setSecondInterval] = useState<number | "">(0)

  // Custom Interval
  const [customInterval, setCustomInterval] = useState("5")

  useEffect(() => {
    setToggle(false) // delete reload whenever the intervals are changed
    //setCustomInterval(String(minuteInterval))
  }, [minuteInterval])

  useEffect(() => {
    setToggle(false) // delete reload whenever the intervals are changed
    //setCustomInterval(String(secondInterval))
  }, [secondInterval])

  useEffect(() => {
    setToggle(false) // delete reload whenever the intervals are changed

    formatIntervalInputs(+customInterval)
  }, [customInterval])

  useEffect(() => {
    // create reload if toggle is ON (true)
    if (toggle) createReload()
  }, [toggle])

  async function createReload() {
    const interval = +minuteInterval * 60 + +secondInterval

    const response = await sendToBackground({
      name: "createReload",
      body: {
        interval
      }
    })

    if (response?.error) setToggle(false)
  }

  // *** Convert intervals into minutes and seconds and store the values into the input fields. *** //
  function formatIntervalInputs(interval: number) {
    if (interval > 60) {
      setMinuteInterval(interval / 60)
      setSecondInterval(interval % 60)
    } else {
      setMinuteInterval(0)
      setSecondInterval(interval)
    }
  }

  return (
    <ThemeProvider>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          width: 241,
          padding: 15,
          paddingTop: 10,
          paddingBottom: 10
        }}>
        <Stack>
          <Flex gap="1rem">
            <NumberInput
              id="minuteInterval"
              value={minuteInterval}
              onChange={setMinuteInterval}
              label="Minutes"
              min={0}
            />
            <NumberInput
              id="secondInterval"
              value={secondInterval}
              onChange={setSecondInterval}
              label="Seconds"
              min={0}
            />
          </Flex>
          <Group position="center">
            <Switch
              checked={toggle}
              onChange={(event) => setToggle(event.currentTarget.checked)}
              sx={{
                label: {
                  width: "220px"
                }
              }}
              onLabel="ON"
              offLabel="OFF"
              size="xl"
            />
          </Group>

          <Radio.Group value={customInterval} onChange={setCustomInterval}>
            <Group>
              <Stack spacing={0} align="center">
                <Radio value="5" id="intervalOne" />
                <label htmlFor="intervalOne">0:05</label>
              </Stack>
              <Stack spacing={0} align="center">
                <Radio value="15" id="intervalTwo" />
                <label htmlFor="intervalTwo">0:15</label>
              </Stack>
              <Stack spacing={0} align="center">
                <Radio value="30" id="intervalThree" />
                <label htmlFor="intervalThree">0:30</label>
              </Stack>
              <Stack spacing={0} align="center">
                <Radio value="60" id="intervalFour" />
                <label htmlFor="intervalFour">1:00</label>
              </Stack>
              <Stack spacing={0} align="center">
                <Radio value="120" id="intervalFive" />
                <label htmlFor="intervalFive">2:00</label>
              </Stack>
            </Group>
          </Radio.Group>

          <Divider size="xs" />
          <Group position="apart" spacing={5}>
            <Checkbox id="blockReload" label="Block Auto Reloading" />
            <Checkbox id="bypassCache" label="Bypass Local Cache" />
            <Tooltip
              label="Open options"
              position="bottom"
              withArrow
              openDelay={750}>
              <UnstyledButton component="a" href="options" target="_blank">
                <IconSettings />
              </UnstyledButton>
            </Tooltip>
          </Group>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

export default Popup
