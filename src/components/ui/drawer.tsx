"use client"

import {
  Drawer,
  DrawerBody as ChakraDrawerBody,
  DrawerHeader as ChakraDrawerHeader,
  DrawerOverlay,
  DrawerContent as ChakraDrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react"
import * as React from "react"

export const DrawerRoot = Drawer
export const DrawerContent = ChakraDrawerContent
export const DrawerCloseTrigger = DrawerCloseButton
export const DrawerHeader = ChakraDrawerHeader
export const DrawerBody = ChakraDrawerBody
export const DrawerBackdrop = DrawerOverlay
export const DrawerTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const DrawerFooter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
