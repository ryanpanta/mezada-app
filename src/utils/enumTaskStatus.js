export const enumTaskStatus = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3
}

export const getLabelTaskStatus = (status) => {
    switch (status) {
        case enumTaskStatus.PENDING:
            return "Pendente";
        case enumTaskStatus.APPROVED:
            return "Aprovada";
        case enumTaskStatus.REJECTED:
            return "Rejeitada";
        default:
            return "";
    }
}