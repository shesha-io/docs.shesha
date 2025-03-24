---
sidebar_position: 1
---
# Canvas context

It provides access to basic data and methods about the shape and size of application pages

## Available data

`activeDevice: IDeviceTypes` - type of the device applied to the application (`desktop`, `tablet`, `mobile`, `custom`)

`designerDevice: IDeviceTypes` - type of the device used in the designer (`desktop`, `tablet`, `mobile`, `custom`)

`physicalDevice: IDeviceTypes` - type of the pysical device (`desktop`, `tablet`, `mobile`, `custom`)

`designerWidth number` - width of the designer area (px)

`zoom: number` - zoom of the content

## Available API

`setDesignerDevice(deviceType: IDeviceTypes): void` - set the device type fof the designer (`desktop`, `tablet`, `mobile`, `custom`)

`setCanvasWidth(width: number, deviceType: IDeviceTypes): void` - set the width of content

`setCanvasZoom(zoom: number): void` - set zoom of content
