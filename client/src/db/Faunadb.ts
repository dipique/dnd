class FaunaInnerRef {
    id: string = ''
    collection?: FaunaRef
}

class FaunaRef {
    '@ref': FaunaInnerRef
}

export class FaunaItem<T> {
    ref: FaunaRef
    ts: string = ''
    data: T

    constructor(data: T, ref: FaunaRef) {
        this.data = data
        this.ref = ref
    }

    static getId<T>(item: FaunaItem<T>): string {
        return (item.ref["@ref"] as FaunaInnerRef).id
    }

    static withId<T>(item: FaunaItem<T>): T {
        return {
            ...item.data,
            id: FaunaItem.getId(item)
        } as T
    }
}

export class FaunaCollection<T> {
    data: FaunaItem<T>[] = []

    static getItems<T>(col: FaunaCollection<T>): T[] {
        return col.data.map(FaunaItem.withId)
    }
}