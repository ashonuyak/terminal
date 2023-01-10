export interface CreateCustomization {
  textColor: string;
  backgroundColor: string;
}

export interface UpdateCustomization extends CreateCustomization {
  id: string;
}
