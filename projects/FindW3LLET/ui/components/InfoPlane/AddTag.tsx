'use client'

import { useAddTag, useAddTagEvent, useGetBaseFee, useGetTags } from '@/server/findwalletServer'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { formatEther, parseEther } from 'viem'

function matchLimitBytes(str: string, maxBytes: number) {
  if (str === '') return false
  let bytes = 0

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)

    if (charCode >= 0x4e00 && charCode <= 0x9fff) {
      bytes += 3
    } else {
      bytes += 1
    }
  }
  if (bytes > maxBytes) {
    return false
  }
  return true
}

function matchMinWeightBar(inputWeight: string, minWeight: string) {
  return parseFloat(inputWeight) >= parseFloat(minWeight)
}

type Props = {
  walletId: string
}

// to-do
function AddTag({ walletId }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [value, setValue] = useState('')
  const [weight, WriteWeight] = useState('')
  const [minWeight, setMinWeight] = useState('')
  // validate
  const weightInputIsInvalid = useMemo(() => {
    if (weight === '') return false
    return matchMinWeightBar(weight, minWeight) ? false : true
  }, [minWeight, weight])

  const tagInputIsInvalid = useMemo(() => {
    if (value === '') return false
    return matchLimitBytes(value, 20) ? false : true
  }, [value])
  const { data } = useGetTags(parseInt(walletId))

  useEffect(() => {
    function weightCoverToString() {
      if (data === undefined) return
      if (data.length < 5) {
        setMinWeight('0')
        return
      }
      const weightFees = data.map(item => parseFloat(formatEther(item.tagWeight)))
      const value = weightFees.sort((a, b) => a - b)[0]
      value && setMinWeight(value.toString())
    }
    weightCoverToString()
  }, [data])

  // addTag
  const { write } = useAddTag()
  const addTag = (id: any, tag: string, weight: string) => {
    write({ args: [id, tag], value: parseEther(weight) })
  }

  // listener
  useAddTagEvent()
  // submit action
  const onClick = (onClose: () => void) => {
    if (!matchLimitBytes(value, 20)) {
      alert("The tag can't be empty or over 20 characters")
      return
    }
    if (!matchMinWeightBar(weight, minWeight)) {
      alert('Your weight is no enough to add the new Tag')
      return
    }
    addTag(parseInt(walletId), value, weight)
    setValue('')
    WriteWeight('')
    onClose()
  }

  const onCancal = (onClose: () => void) => {
    setValue('')
    WriteWeight('')
    onClose()
  }

  return (
    <>
      <Button onPress={onOpen} variant='bordered' size='sm' radius='full'>
        {' '}
        +{' '}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Add Tag</ModalHeader>
              <ModalBody>
                <Input
                  label='tag'
                  value={value}
                  autoFocus
                  onValueChange={setValue}
                  color={tagInputIsInvalid ? 'danger' : 'default'}
                  isInvalid={tagInputIsInvalid}
                  errorMessage={tagInputIsInvalid && 'You input is invalid'}
                ></Input>
                <Input
                  label='weight'
                  value={weight}
                  autoFocus
                  onValueChange={WriteWeight}
                  color={weightInputIsInvalid ? 'danger' : 'default'}
                  isInvalid={weightInputIsInvalid}
                  errorMessage={
                    weightInputIsInvalid && `You weight is lower than the ${parseFloat(minWeight).toFixed(18)} eth.`
                  }
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    onCancal(onClose)
                  }}
                >
                  Close
                </Button>
                {/* todo 链上操作 */}
                <Button
                  disabled={!tagInputIsInvalid || !weightInputIsInvalid}
                  onPress={() => {
                    onClick(onClose)
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddTag
