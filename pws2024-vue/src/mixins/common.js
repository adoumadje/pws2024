const getIntersection = (arr1, arr2) => {
    const lookupSet = new Set(arr1)
    return arr2.filter(el => lookupSet.has(el))
}

export default {
    methods: {
        checkIfInRole(session, roles) {
            let intersection = getIntersection(session.roles || [], roles || [])
            return intersection.length > 0
        }
    }
}