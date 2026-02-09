"use client"
import {InputElement} from "@/shared/ui/input";
import {Button, Overlay, Portal} from "@/shared/ui";
import {cn} from "@/shared/utils";

export const LoginModal = () => {
    return (
       <>
           <Portal>
               <Overlay />

               <div className={cn([
                   'absolute top-1/2 left-1/2 -translate-1/2 z-50',
                   'max-w-112.5 w-full p-11.5 rounded-[18px] bg-white',
                   'space-y-5'
               ])}>
                   <div>
                       <h3 className={'font-semibold text-[30px]'}>Вход в аккаунт</h3>
                       <p className={'font-regular text-base text-[#7C7C7C]'}>Введите номер телефона, чтобы войти или зарегистрироваться</p>
                   </div>
                   <form action="" className={'space-y-5'}>
                       <InputElement variant="primary" inputSize="md">
                           <InputElement.Input type='email' placeholder="Email" />
                       </InputElement>
                       <InputElement variant="primary" inputSize="md">
                           <InputElement.Input type='password' placeholder="Password" />
                       </InputElement>
                   </form>
                   <Button className={'w-full'}>
                       Вход
                   </Button>
               </div>

           </Portal>
       </>
    )
}