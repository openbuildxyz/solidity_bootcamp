import { InfoPlane, PlaneProps } from "@/components/InfoPlane";

const props : PlaneProps = {
    className: "flex-1 col-span-2 flex-grow max-h-[90vh]",
    header : { btnContent:'Close', title:'Detail', },
    body : {bodyType:'Detail',id: ''},
    footer: {btnContent:'View the website', w:false, id:''}
}

type Props = {
    params: {
      id: string
    }
  }

export default function Page({ params } : Props) {
    props.body.id = params.id
    props.footer.id = params.id
    return (
        <InfoPlane {...props}  />
    )
}