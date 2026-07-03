interface TeamGridBlockProps {
  members: { name: string; role?: string; photo?: { url: string }; bio?: string }[]
}

export function TeamGridBlockWrapper({ members }: TeamGridBlockProps) {
  if (!members?.length) return null

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              {member.photo?.url ? (
                <img
                  src={member.photo.url}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-mannatech/10 flex items-center justify-center text-mannatech text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{member.name}</h3>
              {member.role && (
                <p className="text-sm text-mannatech mb-2">{member.role}</p>
              )}
              {member.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
