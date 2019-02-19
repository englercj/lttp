// stub `require` for Typescript so we can import webpack resources.
declare var require: (file: string) => any;

declare interface IConstructable<T>
{
    new(...args: any[]): T;
    prototype: T;
}

declare namespace Phaser
{
    export namespace Class
    {
        export function extend(ctor: Function, definition: any, isClassDescriptor: boolean, extend: Function): void;
        export function mixin(myClass: Function, mixins: any[]): void;
    }
}
