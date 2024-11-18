interface ContainerCommons {
  status: number | string;
}

export interface ContainerList<T> extends ContainerCommons {
  data: T[];
}
export interface Container<T> extends ContainerCommons {
  data: T;
}
