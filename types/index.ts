export { }

declare global {
    type Nullable<T> = T | null

    type ColumnData = (string | number)[]

    interface CellData {
        data: any
        type: 'data' | 'header'
        hint?: string
        icon?: string
    }
}