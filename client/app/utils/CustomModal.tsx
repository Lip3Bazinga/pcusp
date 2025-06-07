import React, { FC } from "react"
import { Modal, Box } from "@mui/material"

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
}

const CustomModal: FC<Props> = (
  { open, setOpen, setRoute, component: Component }
) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      arial-labelledby="modal-modal-title"
      arial-describedby="modal-modal-description"
    >
      <Box
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-[#8C52FF]/20 border border-[#8C52FF]/30 rounded-2xl shadow-lg backdrop-blur-md p-4 outline-none"
      >
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  )
}

export default CustomModal